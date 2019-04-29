import {lazyEquals} from './LazyComponents';
import {assert} from 'chai';

describe('LazyComponent', function() {

    it('basic', function() {

        assert.ok(lazyEquals(1, 1));
        assert.ok(lazyEquals(null, null));
        assert.ok(lazyEquals(undefined, undefined));

        assert.ok(lazyEquals({oid: 1}, {oid: 1}));

    });

});
