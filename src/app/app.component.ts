import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { PanZoomConfig } from 'ngx-panzoom';
import { TreeNode } from 'primeng/api';
import { Observable } from 'rxjs';
import * as json from '../assets/data.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'Lineage';
  isBrowser: boolean;
  tree: TreeNode[] = [
    {label: 'Cards', styleClass: 'Lineage-node rounded node-shadow', type: 'person', data: {}, expanded: true,children:[
      {label: 'Cards', styleClass: 'Lineage-node rounded node-shadow', type: 'person', data: {}, expanded: false,children:[
        {label: 'Cards', styleClass: 'Lineage-node rounded node-shadow', type: 'person', data: {}, expanded: false,children:[]}
      ]}
    ]}
];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient){
    this.isBrowser = isPlatformBrowser(platformId);
    // let data: any = json;
    // console.log(data);
    // fetch('../assets/data.json')
    //   .then(response => response.json())
    //   .then(data => {
    //     let lineage= {label: 'Domain', styleClass: 'Lineage-node rounded node-shadow', type: 'person', expanded: true, children:[]};
    //     if(data && data.length>0){
    //       lineage.children = this.fetchChild(data);
    //     }
    //     // console.log(lineage);
    //     this.tree = [lineage];
    //   });
  }

  panZoomConfig: PanZoomConfig = new PanZoomConfig({
    initialZoomToFit: { x: 70, y: -400, height: 800, width: 800 },
    zoomOnDoubleClick: false,
    zoomOnMouseWheel: false,
    dynamicContentDimensions: true
  });

  ngOnInit(): void {
    this.getData().subscribe({
      next: data =>{
        let lineage= {label: 'Domain', styleClass: 'Lineage-node rounded node-shadow', type: 'person', data:{type:""}, expanded: true, children:[]};
        if(data && data.length>0){
          lineage.children = this.fetchChild(data);
        }
        console.log(lineage);
        this.tree = [lineage];
      }
    });
  }

  fetchChild(lineage: lineage[]): any{
    return lineage.map(x => {
      const node: TreeNode = {
        label: x.name,
        type: 'person',expanded: false,
        styleClass: `Lineage-node rounded node-shadow`,
        children: []
      };
      if(x.coderepository&&x.coderepository!=""){
        node.data = {
          c: x.coderepository, n: x.notebook_used, u: x.unittest, type: x.type
        }
        // node.data.c = x.coderepository;
        // node.data.n = x.notebook_used;
        // node.data.u = x.unittest;
      }else{
        node.data = {type: x.type}
      }
      if (x.child && x.child.length > 0) {
        const a = this.fetchChild(x.child);
        if (x.child && x.child.length > 0 && node.children) {
          node.children.push(...a);
        } else {
          node.children = a;
        }
      }
      return node;
    });
  }

  getData(): Observable<any>{
    return this.http.get("../assets/data.json");
  }
}

export interface lineage {
  "name": string,
		"type": string,
		"notebook_used": string,
		"unittest": string,
		"coderepository": string,
		"child": lineage[]
}