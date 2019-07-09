class Animal {
    private readonly name: any;

    public constructor(name) {
        this.name = name;
    }

    public sayHi() {
        return `My name is ${this.name}`;
    }
}

let a = new Animal('Jack');
console.log(a.sayHi()); // My name is Jack