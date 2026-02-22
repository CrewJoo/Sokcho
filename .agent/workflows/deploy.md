---
description: GitHub에 커밋 & 푸시하여 배포
---

# GitHub 커밋 & 배포

1. 변경 사항을 확인합니다:
```bash
cd e:\Demo\007_PREP_5Dsay && git status
```

2. 변경된 파일을 스테이징합니다:
```bash
cd e:\Demo\007_PREP_5Dsay && git add -A
```

3. 커밋 메시지를 작성합니다 (변경 내용을 한국어로 요약):
```bash
cd e:\Demo\007_PREP_5Dsay && git commit -m "변경 내용 요약"
```

4. GitHub에 푸시합니다:
```bash
cd e:\Demo\007_PREP_5Dsay && git push origin main
```

5. Vercel 등 연결된 호스팅이 있다면 자동 배포가 진행됩니다.
