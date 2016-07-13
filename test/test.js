'use strict';

let mdTags = require('..');
let assert = require('assert');
let should = require('should');

const post = `
# Title

_January 30, 2016_

#nodejs, #markdown, #my-tag;`;

const post2 = `
# Title

_January 31, 2016_

#my-tag;`;

const post3 = `
# Title

_January 31, 2016_`;

const post_empty = `

`;

let posts = [];
posts.push(post, post2, post3);

describe('md-tags', function () {
    it('md-tags should be a function and have 2 public methods', function () {
        var mdtags = mdTags();
        mdtags.should.be.a.Function;
        mdtags.should.have.property('tagsForPost');
        mdtags.tagsForPost.should.be.a.Function;
        mdtags.should.have.property('postsForTag');
        mdtags.postsForTag.should.be.a.Function;
    });
    describe('tagsForPost', function () {
        it('should return undefined when parameters are empty', function () {
            assert.equal(undefined, mdTags().tagsForPost());
            assert.equal(undefined, mdTags().tagsForPost(null));
            assert.equal(undefined, mdTags().tagsForPost(post_empty));
        });
        it('should tag with spaces should be parsed properly', function () {
            assert.equal("#meetup, #.net, #Mobile Development", mdTags().tagsForPost("#meetup, #.net, #Mobile Development").md);
            assert.equal("meetup, .net, Mobile Development", mdTags().tagsForPost("#meetup, #.net, #Mobile Development").text);
            assert.deepEqual(["meetup", ".net", "Mobile Development"], mdTags().tagsForPost("#meetup, #.net, #Mobile Development").list);
        });
        it('should return md', function () {
            assert.equal("#nodejs, #markdown, #my-tag", mdTags().tagsForPost(post).md);
            assert.equal("#nodejs, #markdown, #my-tag", mdTags().tagsForPost(`#nodejs, #markdown, #my-tag`).md);
        });
        it('should return text', function () {
            assert.equal("nodejs, markdown, my-tag", mdTags().tagsForPost(post).text);
            assert.equal("nodejs, markdown, my-tag", mdTags().tagsForPost(`#nodejs, #markdown, #my-tag`).text);
        });
        it('should return list', function () {
            assert.deepEqual(["nodejs", "markdown", "my-tag"], mdTags().tagsForPost(post).list);
            assert.deepEqual(["nodejs", "markdown", "my-tag"], mdTags().tagsForPost(`#nodejs, #markdown, #my-tag`).list);
        });
        it('should return html', function () {
            assert.equal('<div id="" class=""> nodejs, markdown, my-tag </div>', mdTags().tagsForPost(post).html);
        });
    });
    describe('postsForTag', function () {
        it('should return empty array when parameters are empty', function () {
            assert.deepEqual([], mdTags().postsForTag());
            assert.deepEqual([], mdTags().postsForTag(null));
            assert.deepEqual([], mdTags().postsForTag("", post_empty));
        });
        it('should return not empty list', function () {
            mdTags().postsForTag("my-tag", posts).should.be.instanceof(Array).and.have.lengthOf(2);
        });
        it('should return empty list', function () {
            mdTags().postsForTag("not-matched-tag", posts).should.be.instanceof(Array).and.have.lengthOf(0);
        });
    });
});