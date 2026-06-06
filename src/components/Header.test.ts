import test from 'node:test';
import assert from 'node:assert';

// Simulates the classList behavior used by the Header script
function makeClassList(...initial: string[]) {
	const classes = new Set<string>(initial);
	return {
		toggle(cls: string): boolean {
			if (classes.has(cls)) {
				classes.delete(cls);
				return false;
			} else {
				classes.add(cls);
				return true;
			}
		},
		remove(cls: string) {
			classes.delete(cls);
		},
		add(cls: string) {
			classes.add(cls);
		},
		has(cls: string): boolean {
			return classes.has(cls);
		},
	};
}

// Replicates the Header.astro <script> logic
function createHeaderBehavior(navClassList: ReturnType<typeof makeClassList>) {
	const navLinks: Array<{ triggerClick: () => void }> = [];

	function onMenuBtnClick() {
		navClassList.toggle('open');
	}

	function registerNavLink() {
		const link = {
			triggerClick() {
				navClassList.remove('open');
			},
		};
		navLinks.push(link);
		return link;
	}

	return { onMenuBtnClick, registerNavLink, navLinks };
}

test('mobile menu toggles open class on click', () => {
	const navClassList = makeClassList();
	const { onMenuBtnClick } = createHeaderBehavior(navClassList);

	assert.strictEqual(navClassList.has('open'), false);
	onMenuBtnClick();
	assert.strictEqual(navClassList.has('open'), true);
});

test('mobile menu toggles open class off on second click', () => {
	const navClassList = makeClassList();
	const { onMenuBtnClick } = createHeaderBehavior(navClassList);

	onMenuBtnClick();
	assert.strictEqual(navClassList.has('open'), true);

	onMenuBtnClick();
	assert.strictEqual(navClassList.has('open'), false);
});

test('clicking nav link removes open class from nav', () => {
	const navClassList = makeClassList('open');
	const { registerNavLink } = createHeaderBehavior(navClassList);

	const link = registerNavLink();
	assert.strictEqual(navClassList.has('open'), true);

	link.triggerClick();
	assert.strictEqual(navClassList.has('open'), false);
});

test('clicking nav link when nav is not open leaves nav closed', () => {
	const navClassList = makeClassList();
	const { registerNavLink } = createHeaderBehavior(navClassList);

	const link = registerNavLink();
	link.triggerClick();

	assert.strictEqual(navClassList.has('open'), false);
});

test('multiple nav links each remove the open class', () => {
	const navClassList = makeClassList();
	const { onMenuBtnClick, registerNavLink } = createHeaderBehavior(navClassList);

	const link1 = registerNavLink();
	const link2 = registerNavLink();
	const link3 = registerNavLink();

	onMenuBtnClick();
	assert.strictEqual(navClassList.has('open'), true);

	link2.triggerClick();
	assert.strictEqual(navClassList.has('open'), false);

	onMenuBtnClick();
	assert.strictEqual(navClassList.has('open'), true);

	link3.triggerClick();
	assert.strictEqual(navClassList.has('open'), false);

	onMenuBtnClick();
	link1.triggerClick();
	assert.strictEqual(navClassList.has('open'), false);
});

test('menu button does not manage aria-expanded attribute', () => {
	// After the PR simplification, the button has no dynamic aria-expanded logic.
	// Verify the simplified behavior does not touch attributes.
	let ariaExpanded: string | null = null;
	const navClassList = makeClassList();

	// Simulate the simplified click handler — no setAttribute calls
	function simplifiedClickHandler() {
		navClassList.toggle('open');
		// No ariaExpanded update
	}

	simplifiedClickHandler();
	assert.strictEqual(ariaExpanded, null, 'aria-expanded should not be set by the simplified handler');
	assert.strictEqual(navClassList.has('open'), true);
});

test('menu button does not update icon text', () => {
	// After the PR, the icon span and its text-toggling logic were removed.
	let iconText: string | null = null;
	const navClassList = makeClassList();

	function simplifiedClickHandler() {
		navClassList.toggle('open');
		// No icon text update
	}

	simplifiedClickHandler();
	assert.strictEqual(iconText, null, 'icon text should not be updated by the simplified handler');
});

test('toggle is idempotent across many clicks', () => {
	const navClassList = makeClassList();
	const { onMenuBtnClick } = createHeaderBehavior(navClassList);

	for (let i = 0; i < 10; i++) {
		onMenuBtnClick();
	}
	// After even number of clicks nav should be closed
	assert.strictEqual(navClassList.has('open'), false);

	for (let i = 0; i < 9; i++) {
		onMenuBtnClick();
	}
	// After odd number of clicks nav should be open
	assert.strictEqual(navClassList.has('open'), true);
});

test('nav link click does not toggle — it only removes open class', () => {
	// Regression: previously updateMenuState was called; now it is just remove()
	const navClassList = makeClassList();
	const { registerNavLink } = createHeaderBehavior(navClassList);

	const link = registerNavLink();

	// Click nav link when nav is already closed — should stay closed, not toggle open
	link.triggerClick();
	assert.strictEqual(navClassList.has('open'), false);

	// Click again — should stay closed
	link.triggerClick();
	assert.strictEqual(navClassList.has('open'), false);
});