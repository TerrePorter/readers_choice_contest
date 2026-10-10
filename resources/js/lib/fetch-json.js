function getCookie(name) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));

    return match ? decodeURIComponent(match[1]) : null;
}

export async function postJson(url, body) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') ?? '',
        },
        body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error('Request failed');
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}
