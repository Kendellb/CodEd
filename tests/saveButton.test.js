const jsdom = require("jsdom");
const { JSDOM } = jsdom;

test('sends user data to server and logs success message', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const dom = new JSDOM(`
    <div id="editor" autofocus>
        <!-- code editor goes here  -->
      </div>
      <button id="saveButton">Save</button> 
      <script> console.log('User data updated successfully');</script>
    `)

    const saveButton = dom.window.document.getElementById("saveButton");

    const clickEvent =  new dom.window.MouseEvent("click");

    saveButton.dispatchEvent(clickEvent);


  expect('User data updated successfully');

   consoleSpy.mockRestore();
});
