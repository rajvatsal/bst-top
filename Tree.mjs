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

	function deleteItem(val) {
		let node = root;
		while (true) {
			const nodeBranch =
				node.left.data === val
					? "left"
					: node.right.data === val
						? "right"
						: null;

			// continue if val is not in node's branches
			if (nodeBranch === null) {
				if (val < node.data) node = node.left;
				else node = node.right;
				continue;
			}

			// main code
			const mainChild = node[nodeBranch];

			// first case leaf node
			if (mainChild.left === null && mainChild.right === null) {
				node[nodeBranch] = null;
				break;
			}

			// second case has one child
			if (mainChild.left === null || mainChild.right === null) {
				let mainChildBranch = mainChild.left === null ? "right" : "left";
				node[nodeBranch] = mainChild[mainChildBranch];
				mainChild[mainChildBranch] = null;
				break;
			}

			const getLeftMost = (leftMost, parent) => {
				if (leftMost.left !== null) {
					parent = mainChild.right;
					leftMost = parent.left;
					while (true) {
						if (leftMost.left === null) break;
						parent = leftMost;
						leftMost = leftMost.left;
					}
				}
				return { leftMost, parent };
			};

			// last case has two children
			let { leftMost, parent } = getLeftMost(mainChild.right, mainChild);
			let branch = parent === mainChild ? "right" : "left";

			parent[branch] = leftMost.right;

			leftMost.left = mainChild.left;
			leftMost.right = mainChild.right;

			node[nodeBranch] = leftMost;
			break;
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
t.deleteItem(67);
pp(t.root);
