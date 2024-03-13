import Editor from "./editor";



const editor = new Editor(
    document.querySelector('#editor'),
    `Hello`
);

function upState(){
    /*
    const newEditor = new Editor(
        document.querySelector('#editor'),
        `Hello World`
    )
    */
    editor.updateState(`Hello world!`);
}

 document.getElementById('saveButton').addEventListener('click', upState)

/*
 // Function to trigger Rollup bundling
        function bundleScripts() {  

            async function bundle() {
                const config = '../javascripts/rollup.config.mjs';
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
*/
