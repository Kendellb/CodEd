import { rollup } from '../../node_modules/rollup';
import config from '../javascripts/rollup.config.mjs';

 // Function to trigger Rollup bundling
        function bundleScripts() {  
            
            

            async function bundle() {
                // create a bundle
                const bundle = await rollup.rollup(config);

                // write the bundle to disk
                await bundle.write(config.output);

                console.log('Bundling complete!');
            }

            bundle().catch(err => {
                console.error(err);
            });
        }

        // Attach event listener to the button
        document.getElementById('updateState').addEventListener('click', bundleScripts)