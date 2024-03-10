/// <reference types="@sveltejs/kit"/>
/// <reference lib="webworker"/>

declare let self: ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';


console.log({ build, files, version });
