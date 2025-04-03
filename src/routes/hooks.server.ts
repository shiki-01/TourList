import { render } from '@master/css-server'
import config from '../master.css'
import type { RequestEvent, ResolveOptions } from '@sveltejs/kit'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }: { event: RequestEvent, resolve: (event: RequestEvent, opts?: ResolveOptions) => Response }): Promise<Response> {
    return await resolve(event, {
        transformPageChunk: ({ html }: { html: string }) => render(html, config).html
    })
}
