import sort from "./MergeSort.mjs";
import ed from "./ExcludeDuplicates.mjs";
import pp from "./PreetyPrint.mjs";

let ar = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

export default function Node(data = null, left = null, right = null) {
	return { data, left, right };
}

export function Tree(arr) {
	function find(value) {
		let node = root;
		while (true) {
			if (node.data === value) break;
			else if (node.data < value) node = node.right;
			else node = node.left;
		}

		return node;
	}

	function deleteItem(val, entryNode = root) {
		let node = entryNode;
		while (true) {
			const left = node.left;
			const right = node.right;
			if (left.data === val) {
				// left = child && node = parent
				// first case leaf node
				if (left.left === null && left.right === null) {
					node.left = null;
					break;
				}

				// second case has one child
				if (left.left !== null && left.right === null) {
					node.left = left.left;
					left.left = null;
					break;
				}
				if (left.left === null && left.right !== null) {
					node.left = left.right;
					left.right = null;
					break;
				}

				const getLeftMost = (leftMost = left.right, parent = left) => {
					if (leftMost.left !== null) {
						parent = left.right;
						leftMost = parent.left;
						while (true) {
							if (leftMost.left === null) break;
							parent = leftMost;
							leftMost = leftMost.left;
						}
					}
					return { leftMost, parent };
				};

				// add reference of leftMost's children to parent
				const addChildRef = (ref) => {
					if (parent === left) parent.right = ref;
					else parent.left = ref;
				};

				// last case has two children
				let { leftMost, parent } = getLeftMost();

				if (leftMost.right === null && leftMost.left !== null)
					addChildRef(leftMost.left);
				else if (leftMost.right !== null && leftMost.left === null)
					addChildRef(leftMost.right);

				leftMost.left = left.left;
				leftMost.right = left.right;

				node.left = leftMost;

				break;
			} else if (right.data === val) {
				// first case leaf node
				if (right.left === null && right.right === null) {
					node.right = null;
					break;
				}

				// second case has one child
				if (right.left !== null && right.right === null) {
					node.right = right.left;
					right.left = null;
					break;
				}
				if (right.left === null && right.right !== null) {
					node.right = right.right;
					right.right = null;
					break;
				}
			} else if (val < node.data) node = node.left;
			else node = node.right;
		}
	}

	function insert(val) {
		const leafNode = Node(val, null, null);

		let node = root;
		while (true) {
			if (leafNode.data > node.data) {
				if (node.right === null) {
					node.right = leafNode;
					break;
				}
				node = node.right;
			} else if (leafNode.data < node.data) {
				if (node.left === null) {
					node.left = leafNode;
					break;
				}
				node = node.left;
			}
		}
	}

	function buildTree(arr) {
		if (arr.length === 1) return Node(arr[0], null, null);

		const middle = Math.floor(arr.length / 2);
		const node = Node(
			arr[middle],
			buildTree(arr.slice(0, middle)),
			middle === 1 ? null : buildTree(arr.slice(-middle)),
		);
		return node;
	}

	arr = ed(arr);
	const sortedArr = sort(arr);
	let root = buildTree(sortedArr);

	return { root, buildTree, insert, deleteItem };
}

let t = Tree(ar);
pp(t.root);
