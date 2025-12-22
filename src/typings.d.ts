/* Local typings to silence missing Chart.js types when Chart.js isn't installed
   This allows the project to build while leaving a runtime message that
   Chart.js should be installed to enable charts. */

declare module 'chart.js/auto';
declare module 'chart.js';
