/**
 * pnpm install gh-pages -D
 * https://yarnpkg.com/package/gh-pages
 *
 * pnpm run build
 *
 * make sure this file is run as root
 */
import * as ghpages from 'gh-pages'
import {execCmdOnController} from "./SpawnExecOnController.mjs";
import fs from 'node:fs';
//build
{
  const {cmd,stdout,stderr,code,signal} = await execCmdOnController('pnpm run build')
  console.log(stdout);
  if(stderr || code !== 0){
    console.error(stderr);
  }
}
//add nojekyl
fs.writeFileSync("dist/.nojekyll","");
const dir = 'dist'
const options = {
  dotfiles:true,
}
await ghpages.publish(dir, options, function(err) {
  if(err){
    console.error(err);
  }else{
    console.log('Pushed')
  }
});
