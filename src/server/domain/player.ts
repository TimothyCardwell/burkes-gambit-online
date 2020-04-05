import { GameStateError } from "./errors/game-state-error";
import { Faction } from "./faction.enum";
import { Role } from "./role.enum";


export class Player {
    // TODO Comment... private setters, public getters. Only aggregate root should modify state of this class
    private _id: string;
    public id: string = this._id;

    private _name: string;
    public name: string = this._name;

    private _health: number;
    public health: number = this._health;
    public isAlive: boolean = this._health == 0;

    private _maxHealth = (): number => {
        if (this._role == Role.ManualLabor) {
            return 3;
        }

        return 2;
    }

    private _faction: Faction;
    public faction: Faction = this._faction;

    private _isInfected: boolean;
    public isInfected: boolean = this._isInfected;

    private _role: Role;
    public role: Role = this._role;

    private _isRoleUsed: boolean;
    public isRoleUsed: boolean = this._isRoleUsed;

    constructor(name: string) {
        this._id = "import package to generate guid";
        this._name = name;
        this._health = 2;
        this._faction = Faction.Unassigned;
    }

    public assignFaction(faction: Faction): void {
        this._faction = faction;
    }

    public assignRole(role: Role): void {
        this._isRoleUsed = false;
        this._role = role;
    }

    public disinfect(): void {
        this._isInfected = false;
    }

    public handleShot(): void {
        // Throw error if health is below 0
        this._health--;
    }

    public handleHeal(): void {
        if (this._health == this._maxHealth()) {
            // Throw error
        }

        this._health++;
    }

    public infect(): void {
        this._isInfected = true;
    }

    public useRole(): void {
        this._isRoleUsed = true;
    }
}