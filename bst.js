#!/usr/bin/env node

function merge(left, right) {
    let arr = [];
    while (left.length > 0 && right.length > 0) {
        if (left[0] < right[0]) {
            arr.push(left.shift());
        } else {
            arr.push(right.shift());
        }
    }
    return arr.concat(left, right);
}

function mergeSort(array) {
    if (array.length <= 1) {
        return array;
    }
    let middle = Math.floor(array.length / 2);
    let left = array.slice(0, middle);
    let right = array.slice(middle, array.length);
    return merge(mergeSort(left), mergeSort(right));
}

class Node {
    constructor(value) {
        this.value = value;
        this.parent = null;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(array) {
        this.root = this.buildTree(array);
    }

    buildTree(array) {
        if (array.length === 0) {
            return null;
        }
        const sortedArray = mergeSort(array).filter((item, index, self) => {
            return self.indexOf(item) == index;
        });
        const mid = Math.floor(sortedArray.length / 2);
        const root = new Node(sortedArray[mid]);
        const queue = [
            [root, [0, mid - 1]],
            [root, [mid + 1, sortedArray.length - 1]],
        ];
        while (queue.length > 0) {
            const [parent, [left, right]] = queue.shift();

            // if there are elements to process and parent node is not NULL
            if (left <= right && parent != null) {
                const mid = Math.floor((left + right) / 2);
                const child = new Node(sortedArray[mid]);

                // set the child node as left or right child of the parent node
                if (sortedArray[mid] < parent.value) {
                    parent.left = child;
                } else {
                    parent.right = child;
                }
                child.parent = parent;

                // push the left and right child and their indices to the queue
                queue.push([child, [left, mid - 1]]);
                queue.push([child, [mid + 1, right]]);
            }
        }
        return root;
    }

    prettyPrint(node, prefix = "", isLeft = true) {
        if (node === null) {
            return;
        }
        if (node.right !== null) {
            this.prettyPrint(
                node.right,
                `${prefix}${isLeft ? "│   " : "    "}`,
                false
            );
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
        if (node.left !== null) {
            this.prettyPrint(
                node.left,
                `${prefix}${isLeft ? "    " : "│   "}`,
                true
            );
        }
    }

    insert(value) {
        let node = this.root;
        while (node !== null) {
            if (node.value === value) {
                return;
            }
            if (node.value > value) {
                if (node.left === null) {
                    node.left = new Node(value);
                    node.left.parent = node;
                }
                node = node.left;
            } else {
                if (node.right === null) {
                    node.right = new Node(value);
                    node.right.parent = node;
                }
                node = node.right;
            }
        }
    }

    deleteItem(value) {
        let delNode = this.find(value);
        if (delNode === null) {
            return;
        }
        let nodeChild;
        let toDelete = delNode;
        if (delNode.left === null || delNode.right === null) {
            nodeChild = delNode;
        } else {
            if (delNode.right !== null) {
                let current = toDelete.right;
                while (current.left !== null) {
                    current = current.left;
                }
                nodeChild = current;
            } else {
                let successor = delNode.parent;
                while (successor !== null && toDelete === successor.right) {
                    toDelete = successor;
                    successor = successor.parent;
                }
                nodeChild = successor;
            }
        }

        if (nodeChild.left !== null) {
            toDelete = nodeChild.left;
        } else {
            toDelete = nodeChild.right;
        }

        if (toDelete !== null) {
            toDelete.parent = nodeChild.parent;
        }

        if (nodeChild === null) {
            this.root = toDelete;
        } else if (nodeChild === nodeChild.parent.left) {
            nodeChild.parent.left = toDelete;
        } else {
            nodeChild.parent.right = toDelete;
        }

        if (nodeChild !== delNode) {
            delNode.value = nodeChild.value;
        }
    }

    find(value) {
        let node = this.root;
        while (node !== null) {
            if (node.value === value) {
                return node;
            }
            if (node.value > value) {
                node = node.left;
            } else {
                node = node.right;
            }
        }
        return null;
    }

    levelOrder(callback) {
        let node = this.root;
        const queue = [];
        queue.push(node);
        while (queue.length !== 0) {
            node = queue.shift();
            callback(node);
            if (node.left !== null) {
                queue.push(node.left);
            }
            if (node.right !== null) {
                queue.push(node.right);
            }
        }
    }

    inOrder(callback) {
        let node = this.root;
        const stack = [];
        while (node || stack.length) {
            while (node !== null) {
                stack.push(node);
                node = node.left;
            }
            if (stack.length) {
                node = stack.pop();
                callback(node);
                node = node.right;
            }
        }
    }

    preOrder(callback) {
        let node = this.root;
        const stack = [];
        while (node || stack.length) {
            while (node !== null) {
                callback(node);
                stack.push(node);
                node = node.left;
            }
            if (stack.length) {
                node = stack.pop();
                node = node.right;
            }
        }
    }

    postOrder(callback) {
        let node = this.root;
        const stack = [];
        const out = [];
        while (node || stack.length) {
            if (node) {
                // like preOrder , root -> right -> left then reverse
                stack.push(node);
                out.push(node);
                node = node.right;
            } else {
                node = stack.pop();
                node = node.left;
            }
        }
        while (out.length) {
            callback(out.pop());
        }
    }

    height(node) {
        if (node === null) {
            return null;
        }
        let leftCount = 0;
        let rightCount = 0;
        let nextNode = node;
        while (nextNode !== null) {
            if (nextNode.left) {
                nextNode = nextNode.left;
                leftCount++;
            }
            if (nextNode.right) {
                nextNode = nextNode.right;
                leftCount++;
            } else {
                break;
            }
        }
        while (nextNode !== null) {
            if (nextNode.right) {
                nextNode = nextNode.right;
                rightCount++;
            }
            if (nextNode.left) {
                nextNode = nextNode.left;
                rightCount++;
            } else {
                break;
            }
        }

        return leftCount > rightCount ? leftCount : rightCount;
    }

    depth(node) {
        if (node === null) {
            return null;
        }
        let depthCount = 0;
        while (node.parent) {
            node = node.parent;
            depthCount++;
        }
        return depthCount;
    }

    isBalanced(root = this.root) {
        if (root == null) {
            return true;
        }

        // for left and right subtree height
        let lh = this.height(root.left);
        let rh = this.height(root.right);

        // allowed values for (lh - rh) are 1, -1, 0
        if (
            Math.abs(lh - rh) <= 1 &&
            this.isBalanced(root.left) == true &&
            this.isBalanced(root.right) == true
        ) {
            return true;
        }

        // if we reach here means tree is not
        // height-balanced tree
        return false;
    }

    reBalance() {
        if (this.isBalanced()) {
            return;
        } else {
            const newSortedArray = [];
            this.inOrder((node) => newSortedArray.push(node.value));
            this.root = this.buildTree(newSortedArray);
        }
    }
}

const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
tree.insert(80);
tree.insert(6);
tree.insert(1000);
tree.insert(623);
tree.insert(6222);
tree.insert(325125);
tree.prettyPrint(tree.root);
console.log(tree.isBalanced());
console.log(tree.reBalance());
tree.prettyPrint(tree.root);
console.log(tree.isBalanced());
tree.deleteItem(23);
tree.prettyPrint(tree.root);
console.log(tree.isBalanced());
// console.log(tree.depth(tree.find(3)));
// console.log(tree.height(tree.find(3)));
// console.log(tree.find(3));
// tree.preOrder((node) => console.log(node.value));
// console.log("===");
// tree.inOrder((node) => console.log(node.value));
// console.log("===");
// tree.postOrder((node) => console.log(node.value));
