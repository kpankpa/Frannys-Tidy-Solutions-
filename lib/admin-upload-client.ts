export async function uploadImageFiles(files: File[]): Promise<{
  uploaded: string[];
  failures: string[];
}> {
  const uploaded: string[] = [];
  const failures: string[] = [];

  if (!files.length) {
    return { uploaded, failures };
  }

  const body = new FormData();
  for (const file of files) {
    body.append("file", file);
  }

  const response = await fetch("/api/uploads", {
    method: "POST",
    body,
  });

  const data = (await response.json()) as {
    url?: string;
    urls?: string[];
    error?: string;
    errors?: string[];
  };

  if (response.ok && data.urls?.length) {
    return { uploaded: data.urls, failures: data.errors ?? [] };
  }

  if (response.ok && data.url) {
    return { uploaded: [data.url], failures: [] };
  }

  if (!response.ok) {
    failures.push(data.error || "Upload failed.");
    return { uploaded, failures };
  }

  for (const file of files) {
    const single = new FormData();
    single.append("file", file);
    const one = await fetch("/api/uploads", { method: "POST", body: single });
    const oneData = (await one.json()) as { url?: string; error?: string };
    if (one.ok && oneData.url) {
      uploaded.push(oneData.url);
    } else {
      failures.push(oneData.error || file.name);
    }
  }

  return { uploaded, failures };
}
