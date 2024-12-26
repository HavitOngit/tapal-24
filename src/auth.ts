
import { SvelteKitAuth } from "@auth/sveltekit"
// import Google from "@auth/sveltekit/providers/google"
import Github from "@auth/sveltekit/providers/github"
export const { handle, signIn, signOut } = SvelteKitAuth({
    trustHost: true,
    providers: [Github],
}) 