export default function Queue(initNode) {
	if (!initNode) {
		throw new Error("No init node provided to queue");
		return;
	}
	let queue = [initNode];

	const enqueue = (...nodes) =>
		nodes.forEach((node) => (node === null ? null : queue.push(node)));
	const dequeue = () => (queue = queue.slice(1));
	const getLength = () => queue.length;
	const getFirst = () => queue[0];

	return { enqueue, dequeue, getLength, getFirst };
}
