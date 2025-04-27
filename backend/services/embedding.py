import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_embedding(text: str, model: str = "text-embedding-3-small") -> list[float]:
    try:
        # Uncomment this after setting up payment method
        # text = text.replace("\n", " ")
        # response = client.embeddings.create(input=[text], model=model)
        # return response.data[0].embedding
        return [0.001] * 1536
    except Exception as e:
        raise RuntimeError(f"get_embedding failed: {str(e)}")

# def get_embedding(text: str, model: str = "text-embedding-3-small") -> list[float]:
#     client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
#     response = client.embeddings.create(input=[text], model=model)
#     return response.data[0].embedding

