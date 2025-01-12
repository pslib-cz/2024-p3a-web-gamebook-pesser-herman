using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Edwinschoice.Server.Migrations
{
    /// <inheritdoc />
    public partial class update_items : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ItemImage",
                table: "Items");

            migrationBuilder.AddColumn<string>(
                name: "ItemImagePath",
                table: "Items",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ItemImagePath",
                table: "Items");

            migrationBuilder.AddColumn<byte[]>(
                name: "ItemImage",
                table: "Items",
                type: "BLOB",
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}
