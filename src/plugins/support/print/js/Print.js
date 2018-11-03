class Print  {
    /**
    * Open new window for printing the given content
    *
    * @param string content
    */
    content(content) {
        let printedWindow = window.open('', 'Print', 'left=200, top=200, width=1000, height=1000, toolbar=0, resizable=0');

        if (printedWindow) {
            printedWindow.document.write(content);

            setTimeout(() => {
                printedWindow.print();
                printedWindow.close();
            }, 200);
        } else {
            alert('Please allow printing your browser');
        }
    }
}