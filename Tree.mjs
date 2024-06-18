import sort from "./MergeSort.mjs";
import ed from "./ExcludeDuplicates.mjs";
import pp from "./PreetyPrint.mjs";
import qu from "./Queue.mjs";

let ar = [1, 7, 4, 23, 8, 10, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
let ar1 = [1, 2, 9, 11, 3, 4, 5, 6, 7, 8, 9, 10];

export default function Node(data = null, left = null, right = null) {
	return { data, left, right };
}

export function Tree(arr) {
	function rebalance() {
		let values = levelOrderTraversal();
		values = ed(values);
		values = sort(values);
		root = buildTree(values);
	}

	function isBalanced() {
		const difference = height(root.left.data) - height(root.right.data);
		return difference <= 0 && difference >= -1;
	}

	function depth(val) {
		let count = 0;
		let node = root;
		while (node.data !== val) {
			node = node.data < val ? node.right : node.left;
			++count;
			if (node === null) return -1;
		}
		return count;
	}

	function height(val = undefined) {
		const node = val === undefined ? root : find(val);
		if (node === null) return -1;
		return heightRecur(node, true);
	}

	function heightRecur(node, isFirstStack = undefined) {
		if (node === null) return 0;
		let height = isFirstStack ? 0 : 1;

		const leftBranch = heightRecur(node.left);
		const rightBranch = heightRecur(node.right);

		return (height += leftBranch > rightBranch ? leftBranch : rightBranch);
	}

	function postOrder(cb = undefined) {
		return postOrderRecur(cb, root);
	}

	function postOrderRecur(cb, node) {
		if (node === null) return [];
		return [
			...postOrderRecur(cb, node.left),
			...postOrderRecur(cb, node.right),
			cb === undefined ? node.data : cb(node),
		];
	}

	function inOrder(cb = undefined) {
		return inOrderRecur(cb, root);
	}

	function inOrderRecur(cb, currentNode = root) {
		if (currentNode === null) return [];
		return [
			...inOrderRecur(cb, currentNode.left),
			cb === undefined ? currentNode.data : cb(currentNode),
			...inOrderRecur(cb, currentNode.right),
		];
	}

	function preOrder(cb = undefined) {
		return preOrderRecursive(cb, root);
	}

	function preOrderRecursive(cb, currentNode = root) {
		const value = cb === undefined ? currentNode.data : cb(currentNode);
		const leftSubTree =
			currentNode.left === null ? [] : preOrderRecursive(cb, currentNode.left);
		const rightSubTree =
			currentNode.right === null
				? []
				: preOrderRecursive(cb, currentNode.right);

		return [value, ...leftSubTree, ...rightSubTree];
	}

	function levelOrderTraversal(cb = undefined) {
		const q = qu(root);
		return levelOrderTraversalIterative(cb, q);
	}

	function levelOrderTraversalIterative(cb, queue) {
		const values = [];
		while (queue.getLength()) {
			const currentNode = queue.getFirst();
			const value = cb === undefined ? currentNode.data : cb(currentNode);
			if (value === undefined) {
				throw new Error("Callback didn't return anything");
				return;
			}

			values.push(value);
			queue.enqueue(currentNode.left, currentNode.right);
			queue.dequeue();
		}

		return values;
	}

	function levelOrderTraversalRecursive(cb, queue) {
		if (queue.getLength() === 0) return [];

		const currentNode = queue.getFirst();
		const values = [];

		if (cb === undefined) values.push(currentNode.data);
		else values.push(cb(currentNode));

		queue.dequeue();
		queue.enqueue(currentNode.left, currentNode.right);

		return [...values, ...levelOrderTraversalRecursive(cb, queue)];
	}

	function find(value) {
		let node = root;
		while (true) {
			if (node === null) return null;
			if (node.data === value) break;
			else if (node.data < value) node = node.right;
			else node = node.left;
		}

		return node;
	}

	function deleteItem(val) {
		const isDataInRoot = () => root.data === val;
		let node = root;
		while (true) {
			const nodeBranch = isDataInRoot()
				? null
				: node.left.data === val
					? "left"
					: node.right.data === val
						? "right"
						: null;

			// continue if val is not in node's branches
			if (nodeBranch === null && !isDataInRoot()) {
				if (val < node.data) node = node.left;
				else node = node.right;
				continue;
			}

			// main code
			const mainChild = isDataInRoot() ? root : node[nodeBranch];

			// first case leaf node
			if (mainChild.left === null && mainChild.right === null) {
				node[nodeBranch] = null;
				break;
			}

			// second case has one child
			if (mainChild.left === null || mainChild.right === null) {
				let mainChildBranch = mainChild.left === null ? "right" : "left";
				if (isDataInRoot()) {
					mainChild[mainChildBranch] = root;
					node[mainChildBranch] = null;
					break;
				}
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

			if (!isDataInRoot()) node[nodeBranch] = leftMost;
			else {
				root.left = null;
				root.right = null;
				root = leftMost;
			}
			break;
		}
	}

	function insert(...val) {
		for (let v of val) {
			if (!Number.isInteger(v)) continue;
			const leafNode = Node(v, null, null);

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
	}

	function buildTree(arr, isSanitized = true) {
		arr = isSanitized ? arr : sanitizeArray(arr);
		return buildTreeRecursive(arr);
	}

	function buildTreeRecursive(arr) {
		if (arr.length === 1) return Node(arr[0], null, null);

		const middle = Math.floor(arr.length / 2);
		const node = Node(
			arr[middle],
			buildTree(arr.slice(0, middle)),
			middle === 1 ? null : buildTree(arr.slice(-middle)),
		);
		return node;
	}

	function sanitizeArray(array) {
		array = ed(array);
		return sort(array);
	}

	let root = buildTree(arr, false);

	const getRoot = () => root;

	return {
		getRoot,
		buildTree,
		insert,
		deleteItem,
		find,
		levelOrderTraversal,
		preOrder,
		inOrder,
		height,
		depth,
		isBalanced,
		rebalance,
	};
}

let t = Tree(ar);
pp(t.getRoot());
