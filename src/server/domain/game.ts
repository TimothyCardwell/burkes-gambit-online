import { Player } from "./player";
import { GameState } from "./game-state.enum";
import { GameStateError } from "./errors/game-state-error";
import { Role } from "./role.enum";
import { Faction } from "./faction.enum";

export class Game {
    private _id: string;
    private _name: string;
    private _gameState: GameState;
    private _players: Player[];
    private _powerUps: number;
    private readonly _maxPlayers: number = 8;

    constructor(name: string) {
        this._id = "import package to generate guid";
        this._name = name;
        this._players = [];
        this._gameState = GameState.New;
    }

    public addPlayer(name: string): void {
        if (this._gameState != GameState.New) {
            throw new GameStateError("Cannot add players after the game has started");
        }

        if (this._players.length >= this._maxPlayers) {
            throw new Error(`Cannot add player ${name} as the game has reached the max player count`);
        }

        this._players.push(new Player(name));
    }

    public endGame(): void {
        this._gameState = GameState.Complete;
    }

    public isMaxPowerUpsReached(): boolean {
        var maxPowerups = this._players.length + 1;

        // Per rules, max powerups is one more for max players
        if (this._players.length == this._maxPlayers) {
            maxPowerups++;
        }

        return this._powerUps >= maxPowerups;
    }

    public shuffleInfection(): void {
        this._players.forEach(p => p.disinfect());

        // TODO Select random number between 0 and alivePlayerCount - 1
        const randomPlayer = 0;

        this._players[randomPlayer].infect();
    }

    public startGame(): void {
        this.initalizePlayerFactions();
        this.initializePlayerRoles();
        this.shuffleInfection();
        this._gameState = GameState.InProgress;
        this._powerUps = 0;
    }

    public shootPlayer(shooterId: string, shooteeId: string): void {
        var shootee = this._players.find(p => p.id == shooteeId);
        if (!shootee) {
            throw new Error(`Player ${shooteeId} is not part of this game`);
        }

        shootee.handleShot();
        if (!shootee.isAlive) {
            this.shuffleInfection();
        }
    }

    public healPlayer(healerId: string, healeeId: string): void {
        var healee = this._players.find(p => p.id == healeeId);
        if (!healee) {
            throw new Error(`Player ${healeeId} is not part of this game`);
        }

        healee.handleHeal();
    }

    public powerUp(): void {
        this._powerUps++;
    }

    public useRoleCard(playerId: string) {
        var player = this._players.find(p => p.id == playerId);
        if (!player) {
            throw new Error(`Player ${playerId} is not part of this game`);
        }

        player.useRole();
    }

    private initalizePlayerFactions(): void {
        if (this._gameState != GameState.New) {
            throw new GameStateError("Cannot initialize roles after the game has started");
        }

        const factionCards: string[] = [];
        if (this._players.length > 6) {
            // 3 ASSes
            factionCards.concat(Array(3).fill(Faction.AcquisitionSupportSpecialist.toString()));
            factionCards.concat(Array(this._players.length - 3).fill(Faction.SalvageCrew.toString()));
        } else if (this._players.length > 4) {
            // 2 ASSes
            factionCards.concat(Array(2).fill(Faction.AcquisitionSupportSpecialist.toString()));
            factionCards.concat(Array(this._players.length - 2).fill(Faction.SalvageCrew.toString()));
        } else {
            // 1 ASS
            factionCards.concat(Array(1).fill(Faction.AcquisitionSupportSpecialist.toString()));
            factionCards.concat(Array(this._players.length - 1).fill(Faction.SalvageCrew.toString()));
        }

        // _shuffleCards

        for (let i = 0; i < this._players.length; i++) {
            const player = this._players[i];
            const faction = Faction[factionCards[i]];
            player.assignFaction(faction);
        }
    }

    private initializePlayerRoles(): void {
        if (this._gameState != GameState.New) {
            throw new GameStateError("Cannot initialize roles after the game has started");
        }

        const roleCards = Object.keys(Role);

        // Remove captain from role list
        const captainIndex = roleCards.indexOf(Role.Captain.toString());
        roleCards.splice(captainIndex, 1);

        // TODO Shuffle roles (import package)

        // Take top N-1 roles (N == player count)
        roleCards.slice(this._players.length - 1);

        // Add Captain back to roles
        roleCards.push(Role.Captain.toString());

        // TODO Reshuffle roles (import package)
        for (let i = 0; i < roleCards.length; i++) {
            const player = this._players[i];
            const role = Role[roleCards[i]];
            player.assignRole(role);
        }
    }
}