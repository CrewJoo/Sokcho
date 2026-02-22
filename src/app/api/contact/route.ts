import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Consultation Request Received:', body);

        // 1. Save to Supabase DB (if configured)
        if (supabase) {
            const { error: dbError } = await supabase
                .from('coaching_requests')
                .insert([
                    {
                        email: body.email,
                        age: body.age,
                        job: body.job,
                        goal: body.goal,
                        types: body.types,
                        created_at: new Date().toISOString(),
                    },
                ]);

            if (dbError) {
                console.error('Supabase Error:', dbError);
            }
        } else {
            console.warn('Supabase is not configured. Skipping DB save.');
        }

        // 2. Send Email via Resend (if configured)
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
            const resend = new Resend(resendApiKey);
            const adminEmail = process.env.ADMIN_EMAIL || 'prepjoo@gmail.com';

            const { error: emailError } = await resend.emails.send({
                from: 'PREP Coaching <onboarding@resend.dev>',
                to: [adminEmail],
                subject: `[PREP] 새로운 코칭 신청: ${body.job} - ${body.goal}`,
                html: `
                    <h1>새로운 코칭 신청이 접수되었습니다!</h1>
                    <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
                        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">이메일</td><td style="padding: 8px; border: 1px solid #ddd;">${body.email}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">연령대</td><td style="padding: 8px; border: 1px solid #ddd;">${body.age}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">직업</td><td style="padding: 8px; border: 1px solid #ddd;">${body.job}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">목표</td><td style="padding: 8px; border: 1px solid #ddd;">${body.goal}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">코칭 유형</td><td style="padding: 8px; border: 1px solid #ddd;">${Array.isArray(body.types) ? body.types.join(', ') : body.types}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">신청 시각</td><td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</td></tr>
                    </table>
                `,
            });

            if (emailError) {
                console.error('Resend Error:', emailError);
            }
        } else {
            console.warn('Resend API key is not configured. Skipping email.');
        }

        return NextResponse.json({ success: true, message: 'Consultation requested successfully' });
    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
