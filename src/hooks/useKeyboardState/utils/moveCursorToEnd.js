const moveCursorToEnd = el => {
	if (typeof el.selectionStart == 'number') {
		el.selectionStart = el.selectionEnd = el.value.length;
	} else if (typeof el.createTextRange != 'undefined') {
		el.focus();
		const range = el.createTextRange();
		range.collapse(false);
		range.select();
	}
};

export default moveCursorToEnd;
