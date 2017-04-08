/**
 * @fileOverview Structure is the JavaScript controller for OSHB structure.
 * @version 1.2
 * Updated for popup display.
 * @author David
 */
(function() {
    // Retains references to frequently used elements.
    var elements = {
        "book": document.getElementById('book'),
        "chapter": document.getElementById('chapter'),
        "verse": document.getElementById('verse'),
        "display": document.getElementById('display'),
        "verseLayout": document.getElementById('verseLayout')
    };
// Utility functions.
    // Utility function to clear child nodes from an element.
    var clearNodes = function(elem) {
        while (elem.childNodes.length > 0) {
            elem.removeChild(elem.firstChild);
        }
    };
// XML handling.
    var chapterXml;
    // Parses the XML string into a DOM document.
    var parseXmlString = function(xml) {
        if (window.DOMParser)
        {
            parser=new DOMParser();
            xmlDoc=parser.parseFromString(xml, "text/xml");
        }
        else // Internet Explorer
        {
            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async=false;
            xmlDoc.loadXML(xml);
        }
        return xmlDoc;
    };
// Navigation elements.
    var bookIndex;
    // Sets the options for the chapter dropdown.
    var setChapters = function() {
        bookIndex = books[elements.book.value].split(' ');
        var i = 1, num = parseInt(bookIndex[0]);
        clearNodes(elements.chapter);
        for (; i <= num; i++) {
            elements.chapter.options[elements.chapter.options.length] = new Option(i);
        }
        elements.chapter[initialChapter].selected = "selected";
        initialChapter = 0;
        setVerses();
    };
    // Sets the test file for the demo.
    var setFile = function() {
        var book = elements.book.value;
        var chapter = elements.chapter.value;
        if (book === 'Gen') {
            switch (chapter) {
                case '1':
                    return chapter0;
                case '8':
                    return chapter1;
                case '32':
                    return chapter2;
            }
        } else if (book === 'Ps' && chapter === '1') {
            return chapter3;
        }
        return chapter0;
    };
    // Sets the options for the verse dropdown.
    var setVerses = function() {
        chapterXml = parseXmlString(setFile());
        var i = 1, num = bookIndex[elements.chapter.value];
        clearNodes(elements.verse);
        for (; i <= num; i++) {
            elements.verse.options[elements.verse.options.length] = new Option(i);
        }
        getVerse();
    };
// Interface elements.
    // Marks up the verse.
    // Interprets the accents.
    var accentInterpretation = window.accentInterpretation;
    // Gets the selected verse.
    function getVerse() {
        var index = elements.verse.value - 1;
        var verse = chapterXml.getElementsByTagName('verse')[index];
        // Set the scope based on the verse ID.
        accentInterpretation.setAccents(verse.getAttribute('osisID'));
        clearNodes(elements.display);
        elements.display.appendChild(markupVerse(verse));
    }
    // Gets the selected verse layout stylesheet.
    function getVerseLayout() {
        var layout = elements.verseLayout.value;
        // Adapted from https://www.thesitewizard.com/javascripts/change-style-sheets.shtml
        var i, link_tag ;
        for (i = 0, link_tag = document.getElementsByTagName('link') ;
            i < link_tag.length ; i++ ) {
            if ((link_tag[i].rel.indexOf('stylesheet') != -1) && link_tag[i].title) {
                link_tag[i].disabled = true ;
                if (link_tag[i].title == layout) {
                    link_tag[i].disabled = false ;
                }
            }
        }
        if (layout == "horizontal") {
            markupVerse = window.verseMarkupHorizontal;
        } else if (layout == "vertical") {
            markupVerse = window.verseMarkupVertical;
        }
        getVerse();
    }
    // Initialize.
    var initialChapter = elements.chapter.value - 1;
    var markupVerse = window.verseMarkupHorizontal;
    elements.book.onchange = setChapters;
    elements.chapter.onchange = setVerses;
    elements.verse.onchange = getVerse;
    elements.verseLayout.onchange = getVerseLayout;
    setChapters();
})();
