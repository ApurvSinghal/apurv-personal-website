type ContactMessage = {
  name: string;
  email: string;
  message: string;
};

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL is not configured");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }

  return { supabaseUrl, serviceRoleKey };
}

async function supabaseRequest(input: string | URL, init?: RequestInit) {
  const { serviceRoleKey } = getSupabaseConfig();

  return fetch(input, {
    ...init,
    headers: {
      Accept: "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      ...(init?.headers ?? {}),
    },
  });
}

export async function insertContactMessage(message: ContactMessage) {
  const { supabaseUrl } = getSupabaseConfig();
  const url = new URL(`${supabaseUrl}/rest/v1/contact_messages`);

  const response = await supabaseRequest(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify([message]),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    const responseText = await response.text().catch(() => "");
    console.error("Supabase insert response error", {
      status: response.status,
      responseText: responseText.slice(0, 200),
    });
    throw new Error(
      `Supabase insert failed with status ${response.status}${responseText ? `: ${responseText}` : ""}`,
    );
  }
}

export async function pingSupabase() {
  const { supabaseUrl } = getSupabaseConfig();
  const url = new URL(`${supabaseUrl}/rest/v1/contact_messages`);
  url.searchParams.set("select", "id");
  url.searchParams.set("limit", "1");

  const response = await supabaseRequest(url, {
    method: "GET",
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    const responseText = await response.text().catch(() => "");
    console.error("Supabase ping response error", {
      status: response.status,
      responseText: responseText.slice(0, 200),
    });
    throw new Error(
      `Supabase ping failed with status ${response.status}${responseText ? `: ${responseText}` : ""}`,
    );
  }
}