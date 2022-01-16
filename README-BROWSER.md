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


# Advanced Usage
__Global selector ``__()``__

Draft in progress...

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

Full demo available at ``index.php`` and the ``templates`` folder

# Custom Extensions
Draft in progress...
