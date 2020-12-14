import { createMultiPlugin } from '@blogster/core';
import { fetcherPlugin } from './fetcher-plugin';
import { pusherPlugin } from './pusher-plugin';

const metadata = { platform: 'medium' };
export default createMultiPlugin(fetcherPlugin(metadata), pusherPlugin(metadata));
