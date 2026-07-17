import httpx
from fastapi import FastAPI, Request
from fastapi.responses import Response

app = FastAPI()

TARGET_URL = "https://example.com"  # Replace with your backend target

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def proxy(request: Request, path: str):
    # Construct target URL
    url = f"{TARGET_URL}/{path}"

    # Forward headers and body
    headers = dict(request.headers)
    body = await request.body()

    async with httpx.AsyncClient() as client:
        resp = await client.request(
            method=request.method,
            url=url,
            headers=headers,
            content=body
        )

    return Response(
        content=resp.content,
        status_code=resp.status_code,
        headers=dict(resp.headers)
    )
