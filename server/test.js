const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: 'sk-proj-Q0nO2UPvpXWZdRsfdsHGT3BlbkFJCebK8j1yJ4j6S3EJAJpZ',  // 실제 API 키로 대체하세요
});

async function main() {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "gpt-3.5-turbo",
    });

    console.log(completion.choices[0].message.content);  // 수정된 출력 부분
  } catch (error) {
    if (error.code === 'insufficient_quota') {
      console.error("API 호출 한도를 초과했습니다. 플랜과 청구 정보를 확인하세요.");
    } else {
      console.error("OpenAI API 호출 중 오류가 발생했습니다:", error);
    }
  }
}

main();
