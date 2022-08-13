# Custom Shorthand Functionality

A Collection of JS, CSS & HTML Snippets to be imported or copied into SH stories that will enable additional features or formatting.

## User Guide

The snippets in this repository are organised into directories for each function. I.e. Each directory will contain the necessary code to enable a specific feature.

In some cases, this will be only CSS or only JavaScript. In others, activating the feature will require multiple files.

Unless stated otherwise, all of these code snippets can be used on any SH story by pasting:

- JS snippets in between the `<script>` tags in the Add JS panel
- CSS snippets anywhere in the Add CSS panel
- HTML snippets inline into an HTML Block or Section

Alternatively, the code can be pulled directly from this repository by:

- Adding a `<link>` tag to the Custom Header field to import CSS. E.g.

```
<link rel="stylesheet" type="text/css" href="https://harpoonproductions.github.io/shorthand_utilities/additional_indent/indent.css" />
```

- Adding `<script>` tags to the Add JS panel to import JS. E.g.

```
<script type="text/javascript" src="https://harpoonproductions.github.io/shorthand_utilities/additional_indent/indent.js"></script>
```

This method will be marginally less performant than pasting the snippets in directly (as the stories will need to make an API call to grab the code on load). However, it will also allow the same code to be used across multiple stories without having to copy and paste between each one.

This method also provides a single source of truth for these snippets, which will allow them to be altered from a single location in order to update the functionality for all consuming stories.

### Included Snippets

The following snippets are available in this repository. For instructions on each one, hit `ctrl + f` or `command + f` and search for the name of that snippet, further down this README page:

- Custom Indent
- Show/Hide Sections Button

## Custom Indent

## Show/Hide Sections Button

Example: https://preview.shorthand.com/dVU9WYCd65t3S1ZA#section-1txdLBuGLP
