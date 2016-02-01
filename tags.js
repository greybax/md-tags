'use strict';

var remark = require('remark');
var R = require('ramda');

/**
 * Create new parse markdown tags function
 *
 * @constructor
 * @return {object:{tagsForPost:fn,postsForTag:fn}}
 * @tagsForPost public
 * @postsForTag public
 */
module.exports = function mdTags() {

    return {
        tagsForPost: tagsForPost,
        postsForTag: postsForTag
    }

    /**
     * Method for getting list of tags from a post.
     * @param {string} post - post in markdown syntax.
     * @return {object} {text:string, list: array}
     */
    function tagsForPost(post) {
        if (!post)
            return;

        let text = R.pipe(
            item => remark().parse(item),
            R.prop('children'),
            R.filter(R.propEq('type', 'paragraph')),
            R.map(R.prop('children')),
            R.filter(item => item.length === 1),
            R.map(R.head),
            R.filter(R.propEq('type', 'text')),
            R.map(R.prop('value')),
            R.filter(item => /#[\w-]*,?[\s]*/gim.test(item)),
            R.head)(post);
            
        if (!text) {
            return { text: '', list: [] }
        }
        else {
            return {
                text: text.replace(/#/g, ''),
                list: R.pipe(
                    R.split(/,?[\s]+/gim),
                    R.map(R.tail))(text),
            }
        }
    }
    
    /**
     * Method for getting list of posts for tag.
     * @param {string} tag
     * @param {array} posts List of posts in markdown syntax
     * @return {array} List of post in markdown syntax
     */
    function postsForTag(tag, posts) {
        var list = [];
        
        if (!tag)
            return list;
        
        for (let post of posts) {
            if (tagsForPost(post).text.indexOf(tag) >= 0) {
                list.push(post);
            }
        }

        return list;
    }
}