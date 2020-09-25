import { port } from '../../components/injected_components';
import { parseJoyStickSpeed } from '../../controllers/gamepads/joyStickUtils';

export const newTab = () => {
	window.open();
};

export const closeTab = () => {
	window.close();
};

export const historyBack = () => {
	window.history.back();
};

export const historyForward = () => {
	window.history.forward();
};

export const tabLeft = () => {
	port.postMessage({ type: 'TAB_LEFT', action: true });
};

export const tabRight = () => {
	port.postMessage({ type: 'TAB_RIGHT', action: true });
};

// ? x & y shapes: { coord: number, directionActive: boolean }
export const scroll = (x, y) => {
	const { top, left } = parseJoyStickSpeed(x, y);
	scrollBy({
		top,
		left,
		behavior: 'smooth',
	});
};

export const moveCursor = (x, y, settings) => {
	const { verticalSpeed, horizontalSpeed } = settings.cursor;
	const cursor = document.querySelector('#cursor');
	const leftCoord = window.scrollX + cursor.getBoundingClientRect().left;
	const rightCoord = window.scrollY + cursor.getBoundingClientRect().top;
	const multiplier = 10;
	if (cursor) {
		const xValue = leftCoord
			? leftCoord + x.coord * (horizontalSpeed * multiplier)
			: x.coord;
		const yValue = rightCoord
			? rightCoord + y.coord * (verticalSpeed * multiplier)
			: y.coord;

		cursor.style.transform = `translate3d(${xValue}px, ${
			yValue < window.pageYOffset
				? window.pageYOffset
				: yValue > window.pageYOffset + window.innerHeight
				? window.pageYOffset + window.innerHeight
				: yValue
		}px, 0)`;
	}
};

export const clickFromPoint = () => {
	const cursor = document.querySelector('#cursor');
	const leftCoord = cursor.getBoundingClientRect().left;
	const topCoord = cursor.getBoundingClientRect().top;
	const el = document.elementFromPoint(leftCoord, topCoord);

	el.click();
	if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
		document.elementFromPoint(leftCoord, topCoord).focus();
	} else {
		document.activeElement.blur();
	}
};
