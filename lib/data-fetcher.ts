// This file will be used for backend integration later
// Using native fetch API instead of external dependencies

/**
 * Fetch data from an API endpoint with proper error handling
 * This function is designed to work with React 18's Suspense
 */
export async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      // Add cache control for better performance
      cache: options?.cache || "default",
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    return (await response.json()) as T
  } catch (error) {
    console.error("Fetch error:", error)
    throw error
  }
}

/**
 * Create a resource that can be used with React 18's Suspense
 * This follows the React 18 pattern for data fetching
 */
export function createResource<T>(promise: Promise<T>) {
  let status: "pending" | "success" | "error" = "pending"
  let result: T
  let error: Error

  const suspender = promise.then(
    (data) => {
      status = "success"
      result = data
    },
    (e) => {
      status = "error"
      error = e
    },
  )

  return {
    read() {
      if (status === "pending") {
        throw suspender
      } else if (status === "error") {
        throw error
      } else {
        return result
      }
    },
  }
}

/**
 * Backend integration helper for future use
 * This will be expanded when adding a real backend
 */
export interface BackendOptions {
  endpoint: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  headers?: Record<string, string>
  cache?: RequestCache
}

export async function backendFetch<T>({ endpoint, method = "GET", body, headers, cache }: BackendOptions): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    cache,
  }

  if (body && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(body)
  }

  return fetchData<T>(endpoint, options)
}

/**
 * Prepare for backend integration with React 18's automatic batching
 * This will be used when we add a real backend
 */
export async function fetchProducts(category?: string) {
  // This is a placeholder for future backend integration
  // When we add a backend, we'll replace this with a real API call

  // For now, simulate a network request
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      // This will be replaced with actual API data
      resolve([])
    }, 300)
  })
}
