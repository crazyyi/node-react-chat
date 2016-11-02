import { describe, before, it } from 'mocha';
import { expect } from 'chai';
import incrementer from '../test-utils/lib2';

describe('Hello world', function() {
	it('should increment a value', function() {
		const result = incrementer(8);
		expect(result).eql(9);
	});
});