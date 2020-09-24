const Gamepads = ({ settings, eventsService, debugging }) => {
	let activeGamepads = {};
	let keyboardIsOpen = false;
	let joyStickMarginOfError = 0.09;
	const triggerMarginOfError = 0.8;

	const isDpad = key => [12, 13, 14, 15].includes(key);
	const isTrigger = key => ({
		isTrigger: [6, 7].includes(key),
		triggerSide: {
			6: 'left',
			7: 'right',
		}[key],
	});
	const joyStickIsPushed = axes =>
		axes.filter(axis => Math.abs(axis) > joyStickMarginOfError).length > 0;

	const packageJoyStickAxis = coord => ({
		coord,
		directionActive: Math.abs(coord) > joyStickMarginOfError,
	});

	return {
		get activeGamepads() {
			return activeGamepads;
		},
		execEvent: ev => {
			const { buttons, keyboard, triggers, axis } = settings.mappingTab;

			const indexForButtonPressed = ev.buttons.findIndex(
				b => b.pressed && b.touched
			);

			if (joyStickIsPushed(ev.axes))
				eventsService.handleJoyStick({
					leftStick: {
						actionName: axis.leftStick,
						isActive: joyStickIsPushed([ev.axes[0], ev.axes[1]]),
						x: packageJoyStickAxis(ev.axes[0]),
						y: packageJoyStickAxis(ev.axes[1]),
					},
					rightStick: {
						actionName: axis.rightStick,
						isActive: joyStickIsPushed([ev.axes[2], ev.axes[3]]),
						x: packageJoyStickAxis(ev.axes[2]),
						y: packageJoyStickAxis(ev.axes[3]),
					},
					settings: settings.generalTab,
				});

			if (indexForButtonPressed === -1) return;
			if (
				isTrigger(indexForButtonPressed).isTrigger &&
				ev.buttons[indexForButtonPressed].value < triggerMarginOfError
			) {
				return;
			}

			eventsService.interpretEventByKey(
				isDpad(indexForButtonPressed)
					? {
							index: indexForButtonPressed,
							actionName: { ...buttons }.dPad,
					  }
					: {
							index: indexForButtonPressed,
							actionName: keyboardIsOpen
								? keyboard[indexForButtonPressed]
								: {
										...buttons,
										...triggers,
								  }[indexForButtonPressed],
					  }
			);
		},
		disconnectController: async controllerId => {
			const { [controllerId]: value, ...allOtherControllers } = activeGamepads;

			activeGamepads = allOtherControllers;
		},
		connectController: async controllerId => {
			activeGamepads = {
				...activeGamepads,
				[controllerId]: {
					indexForButtonPressed: true,
					// more meta data will go here
				},
			};
		},
	};
};

export default Gamepads;
