import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './page1.component.html'
})
export class Page1Component implements OnInit {
    index: number = 0;

    list: string[] = [];

    ngOnInit() {
        setTimeout(() => {
            this.list.push('222');
            this.list.push('3333');
        }, 1000);
    }

    setIndex(n: number) {
        this.index = n;
    }

    uiOnViewEnter() {
        console.log('page1 enter');
    }

    uiOnViewLeave() {
        console.log('page1 leave');
    }
}