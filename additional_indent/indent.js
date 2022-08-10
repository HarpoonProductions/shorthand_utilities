(function (d) {
    var qs = 'querySelector';
    var blockquoteSections = d[qs + 'All']('.sh-indent-blockquote');
    blockquoteSections.forEach(function (section) {
        var blockquotes = section[qs + 'All']('blockquote');
        blockquotes.forEach(function (blockquote) {
            blockquote.parentNode.classList.add('indent-blockquote');
        })
    })
})(document)