class FormManager {
    /**
     * Get new form
     * 
     * @param string formSelector
     * @param object options
     * @returns Form
     */
    get(formSelector, options = {}) {
        return new Form(formSelector, options);
    }    
}

DI.register({
    class: FormManager,
    alias: 'forms',
});
// define some global flags
const checked = true,
      selected = true,
      unchecked = false;
