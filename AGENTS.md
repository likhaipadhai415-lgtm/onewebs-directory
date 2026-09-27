<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Serve the OneWebs brand mark from `public/onewebs-mark.png` on every page and use its deployed absolute URL only in leaf-page social metadata, because provider-specific asset paths do not work on external hosts such as Vercel.
- Use one root-mounted IntersectionObserver for scroll text reveals across routes, so up/down replay stays lightweight and respects reduced-motion preferences.
