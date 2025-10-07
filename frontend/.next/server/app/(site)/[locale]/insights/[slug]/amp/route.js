(()=>{var a={};a.id=623,a.ids=[623],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3421:(a,b,c)=>{"use strict";Object.defineProperty(b,"I",{enumerable:!0,get:function(){return g}});let d=c(1237),e=c(5088),f=c(7679);async function g(a,b,c,g){if((0,d.isNodeNextResponse)(b)){var h;b.statusCode=c.status,b.statusMessage=c.statusText;let d=["set-cookie","www-authenticate","proxy-authenticate","vary"];null==(h=c.headers)||h.forEach((a,c)=>{if("x-middleware-set-cookie"!==c.toLowerCase())if("set-cookie"===c.toLowerCase())for(let d of(0,f.splitCookiesString)(a))b.appendHeader(c,d);else{let e=void 0!==b.getHeader(c);(d.includes(c.toLowerCase())||!e)&&b.appendHeader(c,a)}});let{originalResponse:i}=b;c.body&&"HEAD"!==a.method?await (0,e.pipeToNodeResponse)(c.body,i,g):i.end()}}},4870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5736:(a,b,c)=>{"use strict";a.exports=c(4870)},6439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},6487:()=>{},8035:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>C,patchFetch:()=>B,routeModule:()=>x,serverHooks:()=>A,workAsyncStorage:()=>y,workUnitAsyncStorage:()=>z});var d={};c.r(d),c.d(d,{GET:()=>w,revalidate:()=>v});var e=c(5736),f=c(9117),g=c(4044),h=c(9326),i=c(2324),j=c(261),k=c(4290),l=c(5328),m=c(8928),n=c(6595),o=c(3421),p=c(7679),q=c(1681),r=c(3446),s=c(6439),t=c(1356),u=c(8644);let v=300;async function w(a,b){let{locale:c,slug:d}=await b.params;try{let a=await u.T.getInsightBySlug(d,c,{hero_image:{populate:"*"},seo:{populate:"*"},tags:!0,author:!0},{next:{tags:[`insight:${d}:${c}`],revalidate:300}});if(!a)return new Response("Insight not found",{status:404,headers:{"content-type":"text/html; charset=utf-8"}});let b=function(a,b){let c="id"===b?{backToInsights:"Kembali ke Wawasan",by:"Oleh",readTime:"menit baca",ctaTitle:"Tertarik bekerja sama?",ctaDescription:"Mari diskusikan bagaimana CAVOTA dapat membantu bisnis Anda berkembang.",ctaButton:"Hubungi Kami",copyright:"\xa9 2025 CAVOTA. Semua hak dilindungi."}:{backToInsights:"Back to Insights",by:"By",readTime:"min read",ctaTitle:"Interested in working together?",ctaDescription:"Let's discuss how CAVOTA can help your business grow.",ctaButton:"Contact Us",copyright:"\xa9 2025 CAVOTA. All rights reserved."},d="https://cavota.id",e=`${d}/${b}/insights/${a.slug}`,f=`${d}/${b}/insights/${a.slug}/amp`,g=function(a){if(!a)return"";let b=a;return b=(b=(b=(b=(b=(b=(b=(b=(b=b.replace(/<script[^>]*>[\s\S]*?<\/script>/gi,"")).replace(/<style[^>]*>[\s\S]*?<\/style>/gi,"")).replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi,"")).replace(/<img([^>]*?)>/gi,(a,b)=>{let c=b.match(/src\s*=\s*["']([^"']*)["']/i),d=b.match(/alt\s*=\s*["']([^"']*)["']/i),e=b.match(/width\s*=\s*["']?(\d+)["']?/i),f=b.match(/height\s*=\s*["']?(\d+)["']?/i);if(!c)return"";let g=c[1],h=d?d[1]:"",i=e?e[1]:"800",j=f?f[1]:"600",k=g.startsWith("/")?`https://cavota.id${g}`:g;return`<amp-img src="${k}" width="${i}" height="${j}" layout="responsive" alt="${h}" class="inline-image"></amp-img>`})).replace(/<video([^>]*?)>([\s\S]*?)<\/video>/gi,(a,b,c)=>{let d=b.match(/src\s*=\s*["']([^"']*)["']/i),e=b.match(/width\s*=\s*["']?(\d+)["']?/i),f=b.match(/height\s*=\s*["']?(\d+)["']?/i);if(!d)return"";let g=d[1],h=e?e[1]:"640",i=f?f[1]:"360",j=g.startsWith("/")?`https://cavota.id${g}`:g;return`<amp-video src="${j}" width="${h}" height="${i}" layout="responsive" controls></amp-video>`})).replace(/<iframe[^>]*youtube\.com\/embed\/([^"'\s?&]+)[^>]*><\/iframe>/gi,(a,b)=>`<amp-youtube data-videoid="${b}" layout="responsive" width="480" height="270"></amp-youtube>`)).replace(/<iframe(?![^>]*amp-)[^>]*>[\s\S]*?<\/iframe>/gi,"")).replace(/\s*(style|onclick|onload|onerror)\s*=\s*["'][^"']*["']/gi,"")).replace(/<a([^>]*?)>/gi,(a,b)=>(b.includes('target="_blank"')||b.includes("target='_blank'"))&&!b.includes("rel=")?`<a${b} rel="noopener nofollow">`:a)}(a.body),h=function(a){let b=new Set;return b.add('<script async custom-element="amp-img" src="https://cdn.ampproject.org/v0/amp-img-0.1.js"><\/script>'),a.includes("<amp-video")&&b.add('<script async custom-element="amp-video" src="https://cdn.ampproject.org/v0/amp-video-0.1.js"><\/script>'),a.includes("<amp-youtube")&&b.add('<script async custom-element="amp-youtube" src="https://cdn.ampproject.org/v0/amp-youtube-0.1.js"><\/script>'),a.includes("<amp-accordion")&&b.add('<script async custom-element="amp-accordion" src="https://cdn.ampproject.org/v0/amp-accordion-0.1.js"><\/script>'),Array.from(b)}(g),i=a.hero_image?function(a,b){if(!a)return"";let c=a.url,d=a.width||800,e=a.height||600;a.formats?.large?(c=a.formats.large.url,d=a.formats.large.width,e=a.formats.large.height):a.formats?.medium&&(c=a.formats.medium.url,d=a.formats.medium.width,e=a.formats.medium.height),c.startsWith("/")&&(c=`https://cavota.id${c}`);let f=a.alternativeText||a.caption||a.name||"Image";return`<amp-img 
    src="${c}" 
    width="${d}" 
    height="${e}" 
    layout="responsive" 
    alt="${f.replace(/"/g,"&quot;")}"
    class="${"cover"===b?"cover-image":"inline-image"}">
  </amp-img>`}(a.hero_image,"cover"):"",j=a.tags&&a.tags.length>0?`
    <div class="tags">
      ${a.tags.map(a=>`<span class="tag">${a.name}</span>`).join("")}
    </div>
  `:"",k=a.seo?.metaTitle||a.title,l=a.seo?.metaDescription||a.summary||`Insight tentang ${a.title}`,m=function(a,b){let c="https://cavota.id",d=`${c}/${b}/insights/${a.slug}`,e=a.hero_image?a.hero_image.url.startsWith("/")?`${c}${a.hero_image.url}`:a.hero_image.url:`${c}/favicon.png`;return JSON.stringify({"@context":"https://schema.org","@type":"Article",headline:a.title,description:a.seo?.metaDescription||a.summary||`Insight tentang ${a.title}`,datePublished:a.publishedAt,dateModified:a.updatedAt,author:{"@type":"Person",name:a.author?.name||"CAVOTA"},publisher:{"@type":"Organization",name:"CAVOTA",logo:{"@type":"ImageObject",url:`${c}/favicon.png`}},image:[e],mainEntityOfPage:{"@type":"WebPage","@id":d}})}(a,b),n=function(a,b){let c=new Date(a),d={year:"numeric",month:"long",day:"numeric"};try{return c.toLocaleDateString("id"===b?"id-ID":"en-US",d)}catch{return c.toLocaleDateString("en-US",d)}}(a.publishedAt,b),o=a.reading_time?`${a.reading_time} ${c.readTime}`:"";return`<!doctype html>
<html ⚡ lang="${b}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  <link rel="canonical" href="${e}">
  <title>${k}</title>
  <meta name="description" content="${l.replace(/"/g,"&quot;")}">
  ${a.seo?.keywords?`<meta name="keywords" content="${a.seo.keywords}">`:""}
  <meta property="og:title" content="${k}">
  <meta property="og:description" content="${l.replace(/"/g,"&quot;")}">
  <meta property="og:url" content="${f}">
  <meta property="og:type" content="article">
  ${a.hero_image?`<meta property="og:image" content="${a.hero_image.url.startsWith("/")?d+a.hero_image.url:a.hero_image.url}">`:""}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${k}">
  <meta name="twitter:description" content="${l.replace(/"/g,"&quot;")}">
  ${a.hero_image?`<meta name="twitter:image" content="${a.hero_image.url.startsWith("/")?d+a.hero_image.url:a.hero_image.url}">`:""}
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  ${h.join("\n  ")}
  <style amp-custom>
${`
/* CAVOTA AMP Styles - Mobile-first Typography */
:root {
  --brand-primary: #A20F16;
  --brand-secondary: #E51E29;
  --accent: #DEEEED;
  --text-primary: #1a1a1a;
  --text-secondary: #6b7280;
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --border: #e5e7eb;
  --max-content-width: 65ch;
}

/* Reset and Base */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-primary);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-primary);
  -webkit-text-size-adjust: 100%;
}

/* Layout */
.container {
  max-width: var(--max-content-width);
  margin: 0 auto;
  padding: 0 1rem;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  line-height: 1.2;
  margin-bottom: 0.5em;
  color: var(--text-primary);
}

h1 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

h2 {
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  font-weight: 600;
}

h3 {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 600;
}

p, li {
  margin-bottom: 1em;
  max-width: var(--max-content-width);
}

/* Links */
a {
  color: var(--brand-primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

a:hover {
  border-bottom-color: var(--brand-primary);
}

/* Lists */
ul, ol {
  margin-left: 1.5rem;
  margin-bottom: 1em;
}

/* Blockquotes */
blockquote {
  border-left: 4px solid var(--brand-primary);
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: var(--text-secondary);
}

/* Images */
.cover-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.inline-image {
  width: 100%;
  height: auto;
  margin: 1rem 0;
  border-radius: 4px;
}

/* Article Structure */
.breadcrumb {
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.breadcrumb a {
  color: var(--brand-primary);
}

.article-header {
  margin-bottom: 2rem;
  text-align: center;
}

.article-meta {
  margin: 1rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-align: center;
}

.article-meta .author {
  font-weight: 600;
  color: var(--text-primary);
}

.article-body {
  margin-bottom: 3rem;
}

.article-body > * + * {
  margin-top: 1.5rem;
}

/* Tags */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
  justify-content: center;
}

.tag {
  background: var(--accent);
  color: var(--brand-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  border-bottom: none;
}

/* CTA Strip */
.cta-strip {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
  color: white;
  padding: 2rem 1rem;
  text-align: center;
  margin: 3rem 0;
  border-radius: 8px;
}

.cta-strip h3 {
  color: white;
  margin-bottom: 1rem;
}

.cta-button {
  display: inline-block;
  background: white;
  color: var(--brand-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  border-bottom: none;
  transition: transform 0.2s;
}

.cta-button:hover {
  transform: translateY(-1px);
  border-bottom: none;
}

/* Footer */
.footer {
  border-top: 1px solid var(--border);
  padding: 2rem 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 3rem;
}

/* Media Queries */
@media (min-width: 768px) {
  .container {
    padding: 0 2rem;
  }
  
  .article-header {
    text-align: left;
  }
  
  .article-meta {
    text-align: left;
  }
  
  .tags {
    justify-content: flex-start;
  }
}

/* AMP-specific optimizations */
amp-img {
  background-color: var(--bg-secondary);
}

amp-youtube {
  margin: 1.5rem 0;
}

/* Ensure content readability */
.article-body h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.article-body h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

/* Responsive spacing */
@media (max-width: 480px) {
  .container {
    padding: 0 0.75rem;
  }
  
  .cta-strip {
    margin: 2rem -0.75rem;
    border-radius: 0;
  }
}
`.trim()}
  </style>
  <script type="application/ld+json">
${m}
  </script>
</head>
<body>
  <div class="container">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <a href="/${b}/insights">${c.backToInsights}</a>
    </nav>

    <!-- Article Header -->
    <header class="article-header">
      <h1>${a.title}</h1>
      
      <div class="article-meta">
        <span class="author">${c.by} ${a.author?.name||"CAVOTA"}</span>
        <span> • </span>
        <time datetime="${a.publishedAt}">${n}</time>
        ${o?`<span> • </span><span>${o}</span>`:""}
      </div>
      
      ${j}
    </header>

    <!-- Cover Image -->
    ${i}

    <!-- Article Body -->
    <article class="article-body">
      ${g}
    </article>

    <!-- CTA Strip -->
    <section class="cta-strip">
      <h3>${c.ctaTitle}</h3>
      <p>${c.ctaDescription}</p>
      <a href="/${b}/contact" class="cta-button">${c.ctaButton}</a>
    </section>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <p>${c.copyright}</p>
    </div>
  </footer>
</body>
</html>`}(a,c);return new Response(b,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"public, s-maxage=300, stale-while-revalidate=600",vary:"Accept-Encoding"}})}catch(a){return console.error("AMP Route Error:",a),new Response("Internal Server Error",{status:500,headers:{"content-type":"text/html; charset=utf-8"}})}}let x=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/(site)/[locale]/insights/[slug]/amp/route",pathname:"/[locale]/insights/[slug]/amp",filename:"route",bundlePath:"app/(site)/[locale]/insights/[slug]/amp/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"/var/www/linkgacor.one/frontend/app/(site)/[locale]/insights/[slug]/amp/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:y,workUnitAsyncStorage:z,serverHooks:A}=x;function B(){return(0,g.patchFetch)({workAsyncStorage:y,workUnitAsyncStorage:z})}async function C(a,b,c){var d;let e="/(site)/[locale]/insights/[slug]/amp/route";"/index"===e&&(e="/");let g=await x.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:y,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!y){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||x.isDev||y||(G="/index"===(G=D)?"/":G);let H=!0===x.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>x.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>x.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await x.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await x.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),y&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(b instanceof s.NoFallbackError||await x.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},8335:()=>{},8644:(a,b,c)=>{"use strict";c.d(b,{T:()=>f});let d=process.env.STRAPI_TOKEN;class e{constructor(){this.baseUrl="http://localhost:1337",this.token=d}async fetch(a,b={}){let c=`${this.baseUrl}/api${a}`,d={"Content-Type":"application/json"};this.token&&(d.Authorization=`Bearer ${this.token}`);let e=await fetch(c,{...b,headers:{...d,...b.headers}});if(!e.ok){let a=await e.text().catch(()=>e.statusText);throw Error(`Strapi API error: ${e.status} ${e.statusText}. ${a}`)}return e.json()}async getGlobalStrings(a="id"){try{let b=`/global-strings?locale=${a}`;return(await this.fetch(b)).data}catch(a){throw console.error("Error fetching global strings:",a),a}}async getSiteSettings(){try{return(await this.fetch("/site-settings?populate=*")).data}catch(a){throw console.error("Error fetching site settings:",a),a}}async getPageBySlug(a,b="id",c="*",d={}){try{let e=`filters[slug][$eq]=${encodeURIComponent(a)}`,f="*"===c?"populate[0]=sections&populate[1]=sections.items&populate[2]=sections.items.icon&populate[3]=sections.metrics&populate[4]=sections.buttons&populate[5]=sections.media&populate[6]=sections.steps&populate[7]=sections.testimonials&populate[8]=sections.media_web&populate[9]=sections.media_mobile&populate[10]=sections.logos&populate[11]=sections.button":`populate=${c}`,g=`/pages?${e}&locale=${b}&${f}`,h={};d.next&&(h.next=d.next);let i=await this.fetch(g,h);if(i.data&&i.data.length>0)return i.data[0];return null}catch(a){throw console.error("Error fetching page by slug:",a),a}}async getAllPages(a="id"){try{let b=`/pages?locale=${a}&pagination[pageSize]=100`;return(await this.fetch(b)).data||[]}catch(a){throw console.error("Error fetching all pages:",a),a}}async getInsightBySlug(a,b="id",c={hero_image:{populate:"*"},seo:{populate:"*"},tags:!0,author:!0,localizations:!0},d={}){try{let e=encodeURIComponent(JSON.stringify(c)),f=`/insights?filters[slug][$eq]=${encodeURIComponent(a)}&locale=${b}&populate=${e}`,g={};d.next&&(g.next=d.next);let h=await this.fetch(f,g);if(h.data&&h.data.length>0)return h.data[0];return null}catch(a){throw console.error("Error fetching insight by slug:",a),a}}async getInsights(a="id",b=1,c=10,d={}){try{let e=JSON.stringify({hero_image:{populate:"*"},seo:{populate:"*"},tags:!0,author:!0}),f=`/insights?locale=${a}&pagination[page]=${b}&pagination[pageSize]=${c}&populate=${encodeURIComponent(e)}&sort=publishedAt:desc`,g={};return d.next&&(g.next=d.next),await this.fetch(f,g)}catch(a){throw console.error("Error fetching insights:",a),a}}}let f=new e},9294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var b=require("../../../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[873],()=>b(b.s=8035));module.exports=c})();