[Back to main document](https://github.com/skito/ATMF-JS)
# ATMF-JS / Browser enviropment

__Javascript support for ATMF (Advanced-Template-Markup-Format)__

![GitHub release (latest by date)](https://img.shields.io/badge/production-ready-green)
![GitHub release (latest by date)](https://img.shields.io/badge/coverage-100%25-green)

&nbsp;
 
# Setup
Simply load the ATMF browser library in your project. Then set the autodiscovery.
```html
<script type="module" src="../../src/atmf/browser/browser.js"></script>
<script>
  window.onload = function () {
      // Configure auto discovery
      ATMF.SetTemplateDiscoveryPath('../common/templates/', 'html');
      ATMF.SetCultureDiscoveryPath('../common/culture');
      ATMF.SetCulture('en-US');
  };
</script>
```
You can now start using ATMF. You can do so by adding ``data-atmf`` attributes to your DOM elements or by using the global selector function ``__()``. Let's try something simple. Add this code.

```html
<h1 data-atmf="{$hello}"></h1>
```

Then load the page, open the browser console and type:
```javascript
__('$hello', 'Hellow World!')
```

The ATMF browser library will watch all of your body DOM and will automatically evaluate ATMF markup as long as it's available in any ``data-atmf`` attribute.

&nbsp;

# Advanced Usage
__Global selector ``__()``__

```javascript
// Assign variables
__('$fullname', 'Advanced-Template-Markup-Format');
__('$shortname', 'ATMF');
__('$pagetitle', '{$fullname " (" $shortname ")"}');
__('$slogan', 'Cultural made easy!');
__('$userData', __escape('{$crossScripting}'));


// Using ATMF native properties
ATMF.vars['slogan'] = 'Cultural made easy!';
ATMF.DiscoverTemplate('header').then(() => { /* Do something */ });

// State management
var setTime = function () {
    __('$timeNow', __('/date "H:i:s"'));
};
setTime();
setInterval(setTime, 1000);
```

&nbsp;

# Usage Front-End (data attribute)
```html
<h1 data-atmf="{$pageTitle}"></h1>
```

__Language resources__
```html
<h1 data-atmf="{@page.title}"></h1>
<h1 data-atmf="{@page.theFox 10 red}"></h1>
```
Translations available at ``demos/common/culture/`` folder.

__Templates and functions__
```html
<!-- Load ../common/pages/header.html template -->
<!-- according to the autodiscovery function above -->
<div data-atmf="{#template pages/header}"></div> 

<!-- Inline templates -->
<div data-atmf="{#template #inline}">
 <!-- 
     Use either <textarea> or <xmp> as wrapper to bypass browser parsing
     NOTE: <xmp> is depricated, but still supported in most browsers
 -->
 <textarea>
   <h1>{@page.title}</h1>
   {#if $someVar}
    <div>Show me in some condition</div>
   {#else}
    <div>Otherwise show me</div>
   {#end}
 </textarea>
</div>
```

__Extensions__
```html
<h1 data-atmf="Today date is {/date 'M d, Y'}"></h1>
```

&nbsp;

# Usage Front-End (templates)
__Variables__
```html
<h1>{$pageTitle}</h1>
```

__Language resources__
```html            
<h1>{@page.title}</h1>
<h1>{@page.theFox 10 red}</h1>
```
Translations available at ``demos/common/culture/`` folder.

__Functions - #each #if #else #end__
```html
<table style="min-width:500px" cellspacing="10">
    <tr style="font-weight:bold">
        <td>Author Name</td>
        <td>Books</td>
        <td>Sold Out</td>
    </tr>
    {#each $authors as $author}
        <tr>
            <td>
                {$author.firstName " " $author.lastName}
            </td>
            <td>
                <ul>
                {#each $author.books as $book}
                    <li>{$book}</li>
                {#end}
                </ul>
            </td>
            <td>
                {#if $author.soldOut}
                    <span style="color:red">Sold out</span>
                {#else}
                    <span style="color:green">In stock</span>
                {#end}
            </td>
        </tr>
    {#end}
</table>
```

__Extensions__
```html
<h1>Today date is {/date "M d, Y"}</h1>
```

__Escaping with backslash__
```html
<h1>\{@page.title}</h1>
```

Full demo available ``demos/common/templates/`` folder.

&nbsp;

# Custom Extensions
Declare your custom extensions with this interface.
```javascript
class MyCustomExtension
{    
    constructor() {
        this.str = "My custom extension";
    }
    
    Get(args) 
    {
        return this.str;
    }
    
    Set(args, value) 
    {
        this.str = value;
    }
    
    static Register(ATMFEngine) {
        ATMFEngine.extensions.Register('mycustom', new MyCustomExtension());
    }
}
```

Then in your ATMF setup code, call the register function
```javascript
window.addEventListener('load', (e) => {
    MyCustomExtension.Register(ATMFEngine);
};
```

Using the extension
```html
<span data-atmf="{/mycustom}"></span> <!-- OUTPUT: My custom extension -->
```

Using with JS selector
```javascript
__('/mycustom') // Returns "My custom extension"
__('/mycustom', 'Another custom value') // Change the value
__('/mycustom') // Returns "Another custom value"
```
For more advanced example with arguments check the date core extension inside ``src/atmf/engine/ext/date.js``
