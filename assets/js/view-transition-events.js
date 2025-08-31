let lastClickX, lastClickY;

document.addEventListener('click', (event) => {
  // Only track clicks that are not on links, as links trigger navigation directly.
  if (event.target.tagName.toLowerCase() === 'a') return;
  lastClickX = event.clientX;
  lastClickY = event.clientY;
});

// Write position to storage on old page before the view transition snapshot is taken
window.addEventListener('pageswap', (event) => {
  console.log('pageswap event fired!', event);
  if (event.viewTransition) {
    if (lastClickX !== undefined && lastClickY !== undefined) {
      sessionStorage.setItem('lastClickX', lastClickX);
      sessionStorage.setItem('lastClickY', lastClickY);
    }
    console.log('pageswap event detected. Custom view transition logic can be added here.');
    event.viewTransition.updateCallback = () => {
      // This callback runs before the new page is rendered.
      // Any DOM manipulation or other JavaScript that needs to happen
      // before the new page is visible should go here.
      console.log('View transition update callback executed.');
    };
  }
});

// Read position from storage on new page before the first rendering opportunity
window.addEventListener('pagereveal', (event) => {
  console.log('pagereveal event fired!', event);
  if (event.viewTransition) {
    lastClickX = sessionStorage.getItem('lastClickX');
    lastClickY = sessionStorage.getItem('lastClickY');
    // You can now use lastClickX and lastClickY to customize the transition,
    // for example, by animating from the click point.
    // For this example, we are just demonstrating data passing.
    console.log('Pagereveal: lastClickX =', lastClickX, 'lastClickY =', lastClickY);
  }
});

// Manual View Transition for internal links
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a');
  if (
    anchor &&
    anchor.href &&
    anchor.origin === window.location.origin &&
    !anchor.hasAttribute('data-no-view-transition') // Allow opting out
  ) {
    e.preventDefault();

    if (document.startViewTransition) {
      const destinationUrl = anchor.href;

      document.startViewTransition(async () => {
        const response = await fetch(destinationUrl);
        const text = await response.text();
        const newDocument = new DOMParser().parseFromString(text, 'text/html');

        // Update the DOM with the new content
        // Replace only the body content and update the title
        document.body.replaceWith(newDocument.body);
        document.title = newDocument.title;

        // Update the URL in the browser's history
        window.history.pushState({}, '', destinationUrl);

        // Re-initialize scripts that need to run after DOM update
        if (typeof initHeroVideo === 'function') {
          initHeroVideo();
        }
      });
    } else {
      // Fallback for browsers that don't support View Transitions
      window.location.href = anchor.href;
    }
  }
});