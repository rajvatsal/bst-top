export default function ExcludeDuplicates(arr) {
	const exist = [];
	for (let item of arr) if (!exist.includes(item)) exist.push(item);
	return exist;
}
