import {NativeDateService, I18nConfig} from "@ui-kitten/components";

const i18n: I18nConfig = {
	dayNames: {
		short: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
		long: [
			"Domingo",
			"Segunda",
			"Terça",
			"Quarta",
			"Quinta",
			"Sexta",
			"Sábado",
		],
	},
	monthNames: {
		short: [
			"Jan",
			"Fev",
			"Mar",
			"Abr",
			"Mai",
			"Jun",
			"Jul",
			"Ago",
			"Set",
			"Out",
			"Nov",
			"Dec",
		],
		long: [
			"Janeiro",
			"Fevereiro",
			"Março",
			"Abril",
			"Maio",
			"Junho",
			"Julho",
			"Agosto",
			"Setembro",
			"Outubro",
			"Novembro",
			"Dezembro",
		],
	},
};

export const localeDateService = new NativeDateService("br", {
	i18n,
	startDayOfWeek: 0,
});
