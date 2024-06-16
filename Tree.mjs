import sort from "./MergeSort.mjs";
import ed from "./ExcludeDuplicates.mjs";
import pp from "./PreetyPrint.mjs";

let ar = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

export default function Node(data = null, left = null, right = null) {
	return { data, left, right };
}

export function Tree(arr) {
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

	return { root, buildTree, insert };
}
