import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../database.service";
@Component({
  selector: "app-actor",
  templateUrl: "./actor.component.html",
  styleUrls: ["./actor.component.css"],
})
export class ActorComponent implements OnInit {
  actorsDB: any[] = [];
  tempActorsDB: any[] = [];//used for saving actors in extra task
  moviesDB: any[] = [];
  section = 1;
  fullName: string = "";
  bYear: number = 0;
  mvTitle:string="";
  mvYear:number=0;
  aYear:number=0;
  actorId: string = "";
  actorSelected={_id:0};
  movieSelected={_id:0};
  constructor(private dbService: DatabaseService) {}
  //Get all Actors
  onGetActors() {
    this.dbService.getActors().subscribe((data: any[]) => {
      this.actorsDB = data;
      this.onGetActorsWhoActInAtLeast2Movies();
    });
  }
  onGetActorsWhoActInAtLeast2Movies() {
    this.tempActorsDB=[]
    for (let i=0;i<this.actorsDB.length;i++){
      if(this.actorsDB[i].movies.length>=2){
        this.tempActorsDB.push(this.actorsDB[i])
      }
    }
  }
  onGetMovies() {
    this.dbService.getMovies().subscribe((data: any[]) => {
      this.moviesDB = data;
    });
  }
  //Create a new Actor, POST request
  onSaveActor() {
    let obj = { name: this.fullName, bYear: this.bYear };
    this.dbService.createActor(obj).subscribe(result => {
      this.onGetActors();
    });
  }
  onSaveMovie() {
    let obj = { title: this.mvTitle, year: this.mvYear };
    this.dbService.createMovie(obj).subscribe(result => {
      this.onGetMovies();
    });
  }
  // Update an Actor
  onSelectUpdate(item) {
    this.fullName = item.name;
    this.bYear = item.bYear;
    this.actorId = item._id;
    this.actorSelected=item;
  }
  onSelectMovie(item){
    this.movieSelected=item
  }
  onUpdateActor() {
    let obj = { name: this.fullName, bYear: this.bYear };
    this.dbService.updateActor(this.actorId, obj).subscribe(result => {
      this.onGetActors();
    });
  }
  //Delete Actor
  onDeleteActor(item) {
    this.dbService.deleteActor(item._id).subscribe(result => {
      this.onGetActors();
    });
  }
  onDeleteMovie(item) {
    this.dbService.deleteMovie(item._id).subscribe(result => {
      this.onGetMovies();
    });
  }
  onDeleteAllMovieBeforeAYear() {
    this.dbService.deleteAllMovieBeforeAYear(this.aYear).subscribe(result => {
      this.onGetMovies();
    });
  }
  onAddActorIntoMovie(){
    if (this.movieSelected._id!=0&&this.actorSelected._id!=0){
      this.dbService.addActorToMovie(this.movieSelected._id,{id:this.actorSelected._id}).subscribe(result => {
        this.onGetMovies();
      });
      this.dbService.addMovieToActor(this.actorSelected._id,{id:this.movieSelected._id}).subscribe(result => {
        this.onGetActors();
      });
    }else{
      alert("please select actor and movie")
    }
  }
  // This lifecycle callback function will be invoked with the component get initialized by Angular.
  ngOnInit() {
    this.onGetActors();
    this.onGetMovies();
    // this.onGetActorsWhoActInAtLeast2Movies();
  }
  changeSection(sectionId) {
    this.section = sectionId;
    this.resetValues();
  }
  resetValues() {
    this.fullName = "";
    this.bYear = 0;
    this.actorId = "";
  }
}