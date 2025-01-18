using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Edwinschoice.Server.Migrations
{
    /// <inheritdoc />
    public partial class Connection_Update : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Battles_BattlesId",
                table: "Connections");

            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Locations_FromId",
                table: "Connections");

            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Locations_LocationsId",
                table: "Connections");

            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Locations_ToId",
                table: "Connections");

            migrationBuilder.RenameColumn(
                name: "LocationsId",
                table: "Connections",
                newName: "ToBattleId");

            migrationBuilder.RenameColumn(
                name: "BattlesId",
                table: "Connections",
                newName: "FromBattleId");

            migrationBuilder.RenameIndex(
                name: "IX_Connections_LocationsId",
                table: "Connections",
                newName: "IX_Connections_ToBattleId");

            migrationBuilder.RenameIndex(
                name: "IX_Connections_BattlesId",
                table: "Connections",
                newName: "IX_Connections_FromBattleId");

            migrationBuilder.AlterColumn<int>(
                name: "ToId",
                table: "Connections",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<int>(
                name: "FromId",
                table: "Connections",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Battles_FromBattleId",
                table: "Connections",
                column: "FromBattleId",
                principalTable: "Battles",
                principalColumn: "BattlesId");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Battles_ToBattleId",
                table: "Connections",
                column: "ToBattleId",
                principalTable: "Battles",
                principalColumn: "BattlesId");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Locations_FromId",
                table: "Connections",
                column: "FromId",
                principalTable: "Locations",
                principalColumn: "LocationsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Locations_ToId",
                table: "Connections",
                column: "ToId",
                principalTable: "Locations",
                principalColumn: "LocationsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Battles_FromBattleId",
                table: "Connections");

            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Battles_ToBattleId",
                table: "Connections");

            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Locations_FromId",
                table: "Connections");

            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Locations_ToId",
                table: "Connections");

            migrationBuilder.RenameColumn(
                name: "ToBattleId",
                table: "Connections",
                newName: "LocationsId");

            migrationBuilder.RenameColumn(
                name: "FromBattleId",
                table: "Connections",
                newName: "BattlesId");

            migrationBuilder.RenameIndex(
                name: "IX_Connections_ToBattleId",
                table: "Connections",
                newName: "IX_Connections_LocationsId");

            migrationBuilder.RenameIndex(
                name: "IX_Connections_FromBattleId",
                table: "Connections",
                newName: "IX_Connections_BattlesId");

            migrationBuilder.AlterColumn<int>(
                name: "ToId",
                table: "Connections",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "FromId",
                table: "Connections",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Battles_BattlesId",
                table: "Connections",
                column: "BattlesId",
                principalTable: "Battles",
                principalColumn: "BattlesId");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Locations_FromId",
                table: "Connections",
                column: "FromId",
                principalTable: "Locations",
                principalColumn: "LocationsId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Locations_LocationsId",
                table: "Connections",
                column: "LocationsId",
                principalTable: "Locations",
                principalColumn: "LocationsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Locations_ToId",
                table: "Connections",
                column: "ToId",
                principalTable: "Locations",
                principalColumn: "LocationsId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
