window.addEventListener('pageswap', (event) => {
  if (event.viewTransition) {
    console.log('pageswap event detected. Custom view transition logic can be added here.');
    event.viewTransition.updateCallback = () => {
      // This callback runs before the new page is rendered.
      // Any DOM manipulation or other JavaScript that needs to happen
      // before the new page is visible should go here.
      console.log('View transition update callback executed.');
    };
  }
});