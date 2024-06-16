function merge(ar1, ar2) {
	let i = 0;
	let j = 0;
	const merged = [];
	while (true) {
		if (ar1[i] > ar2[j]) {
			merged.push(ar2[j]);
			j++;
		} else {
			merged.push(ar1[i]);
			i++;
		}
		if (i === ar1.length) {
			merged.push(...ar2.slice(j));
			break;
		}
	}
	return merged;
}

export default function sort(ar) {
	if (ar.length === 1) return ar;

	const middle = ar.length / 2;
	const ar1 = ar.slice(0, middle);
	const ar2 = ar.slice(middle);

	return merge(sort(ar1), sort(ar2));
}
